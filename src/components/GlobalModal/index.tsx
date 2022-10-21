import React from "react";
import { useAuth } from "../../hooks/auth";

import { CustomModal } from "../CustomModal";

export function GlobalModal() {
  const { globalModal, openGlobalModal, setOpenGlobalModal } = useAuth();

  return (
    <>
      <CustomModal
        openModal={openGlobalModal}
        setOpenModal={setOpenGlobalModal}
        title={globalModal.title}
        description={globalModal.description}
        okButtonText={globalModal.okButtonText}
        okButtonType={globalModal.okButtonType}
        okButtonAction={globalModal.okButtonAction}
        cancelButtonText={globalModal.cancelButtonText}
        cancelButtonType={globalModal.cancelButtonType}
        cancelButtonAction={globalModal.cancelButtonAction}
        icon={globalModal.icon}
      />
    </>
  );
}
