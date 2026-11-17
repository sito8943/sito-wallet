import { faImage } from "@fortawesome/free-solid-svg-icons";

// components
import { ItemCard, ItemCardTitle } from "../Card";
import { EntityAvatar } from "../EntityAvatar";

// types
import type { CatalogCardPropsType, CatalogRowDto } from "./types";

import "./styles.css";

export function CatalogCard(props: CatalogCardPropsType) {
  const {
    id,
    name,
    subtitle,
    photo,
    showPhoto = false,
    actions,
    onClick,
    editLabel,
    editAriaLabel,
    swipeDeleteOpen,
    onSwipeDelete,
  } = props;

  return (
    <ItemCard<CatalogRowDto>
      title={
        <div className="catalog-card-title-row">
          {showPhoto && <EntityAvatar photo={photo} fallbackIcon={faImage} />}
          <div className="catalog-card-text">
            <ItemCardTitle>{name}</ItemCardTitle>
            {subtitle && (
              <span className="catalog-card-subtitle">{subtitle}</span>
            )}
          </div>
        </div>
      }
      deleted={false}
      name={editLabel}
      aria-label={editAriaLabel}
      onClick={() => onClick(id)}
      actions={actions}
      swipeDeleteOpen={swipeDeleteOpen}
      onSwipeDelete={onSwipeDelete}
      containerClassName="catalog-card-container"
    >
      {null}
    </ItemCard>
  );
}
