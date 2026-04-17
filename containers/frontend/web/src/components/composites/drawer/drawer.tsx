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
    <ModalOverlay className={drawerOverlayStyles()}>
      {composeRenderProps(props.children, (children) => (
        <Modal className={drawerStyles()} isOpen={true}>
          <Dialog className="h-full">{children}</Dialog>
        </Modal>
      ))}
    </ModalOverlay>
  );
}
