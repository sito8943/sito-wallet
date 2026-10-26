import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

// components
import { ItemCard, ItemCardTitle } from "../Card";
import { ProviderPhoto } from "../ProviderPhoto";

// types
import type { CatalogCardPropsType, CatalogRowDto } from "./types";

import "./styles.css";

export function CatalogCard(props: CatalogCardPropsType) {
  const {
    id,
    name,
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
          {showPhoto && (
            <div className="catalog-card-photo">
              {photo ? (
                <ProviderPhoto
                  className="catalog-card-photo-image"
                  photo={photo}
                />
              ) : (
                <FontAwesomeIcon icon={faImage} />
              )}
            </div>
          )}
          <ItemCardTitle>{name}</ItemCardTitle>
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
