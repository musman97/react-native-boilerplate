import React from 'react';

export function useModalState(
  defaultState = false,
): [boolean, () => void, () => void] {
  const [modalShown, setModalShown] = React.useState(defaultState);

  const showModal = React.useCallback(() => {
    setModalShown(true);
  }, []);
  const hideModal = React.useCallback(() => {
    setModalShown(false);
  }, []);

  return [modalShown, showModal, hideModal];
}
