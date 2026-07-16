/** Move a queue item to play immediately after the current item. */
export function moveToPlayNext<T>(
  items: T[],
  fromIndex: number,
  currentIndex: number,
): { items: T[]; newCurrentIndex: number } {
  if (
    fromIndex < 0 ||
    fromIndex >= items.length ||
    fromIndex === currentIndex
  ) {
    return { items, newCurrentIndex: currentIndex };
  }

  const next = [...items];
  const [item] = next.splice(fromIndex, 1);
  const insertAt =
    fromIndex < currentIndex ? currentIndex : currentIndex + 1;
  next.splice(Math.min(insertAt, next.length), 0, item);

  const newCurrentIndex =
    fromIndex < currentIndex ? currentIndex - 1 : currentIndex;

  return { items: next, newCurrentIndex };
}

export function removeQueueItem<T extends { position: number }>(
  items: T[],
  index: number,
  currentIndex: number,
): { items: T[]; newCurrentIndex: number } {
  if (index < 0 || index >= items.length) {
    return { items, newCurrentIndex: currentIndex };
  }

  const next = items
    .filter((_, itemIndex) => itemIndex !== index)
    .map((item, itemIndex) => ({ ...item, position: itemIndex + 1 }));

  let newCurrentIndex = currentIndex;
  if (index < currentIndex) {
    newCurrentIndex = currentIndex - 1;
  } else if (index === currentIndex) {
    newCurrentIndex = Math.min(currentIndex, Math.max(0, next.length - 1));
  }

  return { items: next, newCurrentIndex };
}
