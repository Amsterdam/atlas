import React from 'react'
import styled from 'styled-components'
import { Button, svgFill, themeColor } from '@datapunt/asc-ui'

const StyledButton = styled(Button)`
  border-color: ${themeColor('tint', 'level7')};
  color: ${themeColor('tint', 'level7')};
  background: ${themeColor('tint', 'level1')};
  align-self: flex-start;
  ${svgFill('tint', 'level7')};

  &:hover,
  &:focus {
    outline: 0;
    background: ${themeColor('tint', 'level3')};
  }
`

const ActionButton = ({ fetching, onClick, iconLeft, label, ...otherProps }) => (
  <StyledButton
    disabled={fetching}
    variant="primaryInverted"
    iconLeft={iconLeft}
    iconSize={12}
    onClick={onClick}
    {...otherProps}
  >
    {label}
  </StyledButton>
)

export default ActionButton
