import styled, { keyframes } from "styled-components"

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, 20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
`

const ToastBox = styled.div`
  position: fixed;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  min-width: 280px;
  max-width: 420px;
  padding: 14px 18px;
  border-radius: 12px;
  background: ${({ type }) =>
    type === "error" ? "#f8d7da" : "#d4edda"};
  color: #333;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  font-weight: 600;
  text-align: center;
  z-index: 1100;
  animation: ${slideUp} 0.25s ease;
`

export default function Toast({ message, type = "success" }) {
  if (!message) return null

  return <ToastBox type={type}>{message}</ToastBox>
}