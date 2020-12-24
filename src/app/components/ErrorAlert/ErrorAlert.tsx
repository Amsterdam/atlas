import { Alert, Paragraph } from '@amsterdam/asc-ui'
import { FunctionComponent } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { getMessage } from '../../../shared/ducks/error/error-message'
import { isPrintMode } from '../../../shared/ducks/ui/ui'

const StyledAlert = styled(Alert)`
  /* Ensure outline is visible when element is in focus */
  &:focus {
    z-index: 999;
  }
`

const ErrorAlert: FunctionComponent = () => {
  const message: string = useSelector(getMessage)
  const printMode = useSelector(isPrintMode)

  return !printMode ? (
    <StyledAlert dismissible level="error">
      <Paragraph>{message}</Paragraph>
    </StyledAlert>
  ) : null
}

export default ErrorAlert
