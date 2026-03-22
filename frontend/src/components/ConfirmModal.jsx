import styled from "styled-components"

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const Modal = styled.div`
  width: 100%;
  max-width: 420px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
`

const Title = styled.h2`
  margin-bottom: 12px;
  font-size: 22px;
  color: ${({ theme }) => theme.colors.text};
`

const Message = styled.p`
  margin-bottom: 20px;
  color: #555;
  line-height: 1.5;
`

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`

const Button = styled.button`
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: #fff7ef;
  }
`

const DangerButton = styled.button`
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid #c0392b;
  background: #c0392b;
  color: white;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: #a93226;
    border-color: #a93226;
  }
`

export default function ConfirmModal({
  title = "Confirmar ação",
  message = "Tem certeza que deseja continuar?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel
}) {
  return (
    <Overlay>
      <Modal>
        <Title>{title}</Title>
        <Message>{message}</Message>

        <Actions>
          <Button onClick={onCancel}>{cancelText}</Button>
          <DangerButton onClick={onConfirm}>{confirmText}</DangerButton>
        </Actions>
      </Modal>
    </Overlay>
  )
}