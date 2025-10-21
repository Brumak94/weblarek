import { CDN_URL, categoryMap } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Card, ICard } from "./Card";

export interface ICatalogCard extends ICard {
  category: string;
  image: string;
}

interface ICatalogCardActions {
  onClick: (ev: Event) => void;
}

export class CatalogCard<
  T extends ICatalogCard = ICatalogCard
> extends Card<T> {
  categoryElement: HTMLElement;
  imageElement: HTMLImageElement;

  constructor(container: HTMLElement, actions?: ICatalogCardActions) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container
    );
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container
    );
    if(actions?.onClick){
        this.container.addEventListener("click", actions.onClick);
    }
  }

  set category(value: keyof typeof categoryMap) {
    this.categoryElement.textContent = value;

    Object.keys(categoryMap).forEach((key) => {
      const mapValue = categoryMap[key];
      this.categoryElement.classList.toggle(
        `card__category_${mapValue}`,
        key === value
      );
    });
  }

  set image(value: string) {
    const imageUrl = value.replace(/\.svg$/, '.png');
    this.setImage(this.imageElement, `${CDN_URL}${imageUrl}`);
  }
}
