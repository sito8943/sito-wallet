import { APIClient, Methods } from "@sito/dashboard-app";

// enum
import { Tables } from "./types";

// config
import { config } from "../../config";

// types
import { CreateProfileDto, ProfileDto, UpdateProfileDto } from "lib";

type APIErrorShape = {
  status: number;
  message: string;
};

const toApiError = (error: unknown): APIErrorShape => {
  if (typeof error === "object" && error !== null) {
    const maybeError = error as { status?: number; message?: string };
    if (typeof maybeError.status === "number") {
      return {
        status: maybeError.status,
        message: maybeError.message ?? String(maybeError.status),
      };
    }
  }

  if (error instanceof Error) {
    return {
      status: 500,
      message: error.message,
    };
  }

  return {
    status: 500,
    message: "Unknown error",
  };
};

const parseErrorMessage = (payload: unknown, fallback: string): string => {
  if (typeof payload === "string") return payload || fallback;

  if (typeof payload === "object" && payload !== null) {
    const maybePayload = payload as { message?: string; error?: string };
    return maybePayload.message ?? maybePayload.error ?? fallback;
  }

  return fallback;
};

export default class ProfileClient {
  table: Tables = Tables.Profiles;
  api: APIClient = new APIClient(config.apiUrl, config.auth.user, true, undefined, {
    rememberKey: config.auth.remember,
    refreshTokenKey: config.auth.refreshTokenKey,
    accessTokenExpiresAtKey: config.auth.accessTokenExpiresAtKey,
  });

  async create(data: CreateProfileDto): Promise<number> {
    return await this.api.post<number, CreateProfileDto>(this.table, data);
  }

  async update(id: number, data: UpdateProfileDto): Promise<number> {
    return await this.api.patch<number, UpdateProfileDto>(
      `${this.table}/${id}`,
      data
    );
  }

  async me(): Promise<ProfileDto> {
    return await this.api.doQuery<ProfileDto>(
      `${this.table}/me`,
      Methods.GET,
      undefined,
      {
        ...this.api.defaultTokenAcquirer(),
      }
    );
  }

  async ensureMine(defaultName: string): Promise<ProfileDto> {
    try {
      return await this.me();
    } catch (error) {
      const parsedError = toApiError(error);
      if (parsedError.status !== 404) throw parsedError;

      const parsedDefaultName = defaultName.trim().slice(0, 120);
      if (!parsedDefaultName) throw parsedError;

      try {
        await this.create({ name: parsedDefaultName });
      } catch (createError) {
        // Race-safe: if it was created concurrently, just load it after.
        const parsedCreateError = toApiError(createError);
        if (parsedCreateError.status !== 409) throw parsedCreateError;
      }

      return await this.me();
    }
  }

  async getById(id: number): Promise<ProfileDto> {
    return await this.api.doQuery<ProfileDto>(
      `${this.table}/${id}`,
      Methods.GET,
      undefined,
      {
        ...this.api.defaultTokenAcquirer(),
      }
    );
  }

  async updatePhoto(id: number, file: File): Promise<ProfileDto> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${config.apiUrl}${this.table}/${id}/photo`, {
      method: Methods.PATCH,
      headers: {
        ...this.api.defaultTokenAcquirer(),
      },
      body: formData,
    });

    const payloadText = await response.text();
    let payload: unknown = null;

    try {
      payload = payloadText ? JSON.parse(payloadText) : null;
    } catch {
      payload = payloadText;
    }

    if (!response.ok) {
      throw {
        status: response.status,
        message: parseErrorMessage(payload, response.statusText),
      } as APIErrorShape;
    }

    if (!payload || typeof payload !== "object") {
      throw {
        status: response.status,
        message: "Unknown error",
      } as APIErrorShape;
    }

    return payload as ProfileDto;
  }

  async deletePhoto(id: number): Promise<ProfileDto> {
    return await this.api.doQuery<ProfileDto>(
      `${this.table}/${id}/photo`,
      Methods.DELETE,
      undefined,
      {
        ...this.api.defaultTokenAcquirer(),
      }
    );
  }
}
