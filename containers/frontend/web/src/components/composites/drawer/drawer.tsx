'use client';

import {
  Modal,
  ModalOverlay,
  type ModalOverlayProps,
  composeRenderProps,
  Dialog,
} from 'react-aria-components';

import { drawerOverlayStyles, drawerStyles } from './drawer.styles';

export function Drawer(props: ModalOverlayProps) {
  return (
    <ModalOverlay {...props} className={drawerOverlayStyles()}>
      {composeRenderProps(props.children, (children) => (
        <Modal className={drawerStyles()}>
          <Dialog className="h-[100dvh]">{children}</Dialog>
        </Modal>
      ))}
    </ModalOverlay>
  );
}
