import styled from 'styled-components/native'
import {colors} from '../../theme'

export const WelcomeTitle = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center
`

export const BusinessList = styled.View`
  flex-wrap: wrap;
`

export const Search = styled.View`
  flex-direction: row;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  margin-vertical: 10px;
`

export const AddressInput = styled.TouchableOpacity`
  flex-direction: row;
  background-color: ${colors.inputDisabled};
  border-radius: 10px;
  align-items: center;
  margin-vertical: 5px;
  padding: 10px;
`
