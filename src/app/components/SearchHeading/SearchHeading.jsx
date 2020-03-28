import React from 'react'
import { Heading, themeColor, themeSpacing } from '@datapunt/asc-ui'
import styled from 'styled-components'

const Divider = styled.div`
  width: 200px;
  height: 3px;
  background-color: ${themeColor('support', 'valid')};
  margin-bottom: ${themeSpacing(4)};
`
const StyledHeading = styled(Heading)`
  display: flex;
  justify-content: flex-start;
  margin-bottom: ${themeSpacing(6)};
`

const SearchHeading = ({ label, icon }) => (
  <>
    <Divider />
    <StyledHeading forwardedAs="h2">
      {icon}
      {label}
    </StyledHeading>
  </>
)

export default SearchHeading
