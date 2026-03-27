import { Wrapper, Card, Buttons } from './styles';

interface ModalProps {
  title: string;
  description: string;
  accept: string;
  decline: string;
  handleAccept: () => Promise<void> | void;
  handleDecline: () => Promise<void> | void;
}

const Modal = ({ title, description, accept, decline, handleAccept, handleDecline }: ModalProps) => {
  return (
    <Wrapper>
      <Card>
        <h2>{title}</h2>
        <p>{description}</p>
        <Buttons>
          <button type="button" onClick={handleAccept}>
            {accept}
          </button>
          <button type="button" onClick={handleDecline}>
            {decline}
          </button>
        </Buttons>
      </Card>
    </Wrapper>
  );
};

export default Modal;
