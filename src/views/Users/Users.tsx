import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import {
  ConfirmationDialog,
  Empty,
  Error as ErrorView,
  GlobalActions,
  Page,
  PrettyGrid,
  useDeleteDialog,
  useNotification,
  useRestoreDialog,
} from "@sito/dashboard-app";

import { faAdd, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// providers
import { useManager, useRegisterBottomNavAction } from "providers";

// lib
import type { UserDto} from "lib";
import { isFeatureDisabledBusinessError } from "lib";

// components
import { MobileSelectionBar } from "components";
import { AddUserDialog, EditUserDialog, UserCard } from "./components";

// hooks
import {
  UsersQueryKeys,
  useInfiniteUsersList,
  useMobileMultiSelection,
  useMobileNavbar,
} from "hooks";
import { useAddUser, useEditUser } from "./hooks";

// styles
import "./styles.css";

export function Users() {
  const { t } = useTranslation();
  const { showErrorNotification } = useNotification();

  const manager = useManager();
  const usersClient = "Users" in manager ? manager.Users : null;

  const {
    data,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteUsersList({});

  const items = useMemo(
    () => data?.pages?.flatMap((page) => page.items) ?? [],
    [data?.pages],
  );

  useEffect(() => {
    if (!isFeatureDisabledBusinessError(error)) return;

    showErrorNotification({
      message: t("_pages:featureFlags.moduleUnavailable"),
    });
  }, [error, showErrorNotification, t]);

  const deleteUser = useDeleteDialog({
    mutationFn: async (ids) => {
      if (!usersClient) throw new Error("users.featureDisabled");
      return await usersClient.softDelete(ids);
    },
    ...UsersQueryKeys.all(),
  });

  const restoreUser = useRestoreDialog({
    mutationFn: async (ids) => {
      if (!usersClient) throw new Error("users.featureDisabled");
      return await usersClient.restore(ids);
    },
    ...UsersQueryKeys.all(),
  });

  const addUser = useAddUser();
  const editUser = useEditUser();

  const getActions = useCallback(
    (record: UserDto) => [
      deleteUser.action(record),
      restoreUser.action(record),
    ],
    [deleteUser, restoreUser],
  );

  const mobileSelection = useMobileMultiSelection<UserDto>({
    items,
    getActions,
  });

  useMobileNavbar(t("_pages:users.title"), []);

  const openAddUserRef = useRef(addUser.openDialog);
  useEffect(() => {
    openAddUserRef.current = addUser.openDialog;
  }, [addUser.openDialog]);

  useRegisterBottomNavAction(
    useCallback(() => {
      if (!usersClient) return;
      openAddUserRef.current();
    }, [usersClient]),
  );

  return (
    <Page
      title={t("_pages:users.title")}
      isLoading={isLoading}
      addOptions={{
        onClick: () => addUser.openDialog(),
        disabled: isLoading || !usersClient,
        tooltip: t("_pages:users.add"),
      }}
      queryKey={UsersQueryKeys.all().queryKey}
    >
      {!error ? (
        <>
          <MobileSelectionBar
            className="user-selection-bar"
            count={mobileSelection.selectedCount}
            multiActions={mobileSelection.multiActions}
            onActionClick={mobileSelection.onMultiActionClick}
            onCancel={mobileSelection.clearSelection}
          />
          <PrettyGrid
            data={items}
            className="full-grid max-sm:pb-6"
            hasMore={!!hasNextPage}
            loadingMore={isFetchingNextPage}
            onLoadMore={() => {
              if (!hasNextPage || isFetchingNextPage) return;
              void fetchNextPage();
            }}
            emptyComponent={
              <Empty
                message={t("_pages:users.empty")}
                iconProps={{
                  icon: faUsers,
                  className: "text-5xl max-md:text-3xl text-text-muted",
                }}
                action={{
                  icon: <FontAwesomeIcon icon={faAdd} />,
                  id: GlobalActions.Add,
                  disabled: isLoading || !usersClient,
                  onClick: () => addUser.openDialog(),
                  tooltip: t("_pages:users.add"),
                }}
              />
            }
            renderComponent={(user) => (
              <UserCard
                actions={getActions(user)}
                onClick={(id: number) => editUser.openDialog(id)}
                selectionMode={mobileSelection.selectionMode}
                selected={mobileSelection.isSelected(user.id)}
                onSelect={mobileSelection.onToggleRowSelection}
                onLongPress={mobileSelection.onLongPressRow}
                {...user}
              />
            )}
          />

          <AddUserDialog {...addUser} />
          <EditUserDialog {...editUser} />
          <ConfirmationDialog {...deleteUser} />
          <ConfirmationDialog {...restoreUser} />
        </>
      ) : (
        <ErrorView error={error} />
      )}
    </Page>
  );
}
