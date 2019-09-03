import React from 'react'
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react'
import { withKnobs, boolean } from '@storybook/addon-knobs'
import AboutBlock from '../components/AboutBlock'

storiesOf('Dataportaal/Frontpage', module)
  .addDecorator(storyFn => (
    <div style={{ padding: '40px 0px', background: 'rgb(250,250,250)' }}>{storyFn()}</div>
  ))
  .addDecorator(withKnobs)
  .add('About data and site', () => <AboutBlock loading={boolean('loading', false)} />)
