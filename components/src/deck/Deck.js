// @flow
import * as React from 'react'
import cx from 'classnames'
import flatMap from 'lodash/flatMap'
import type {DeckSlot} from '../robot-types'

import {
  SLOTNAME_MATRIX,
  DECK_WIDTH,
  DECK_HEIGHT,
  SLOT_WIDTH,
  SLOT_HEIGHT,
  SLOT_SPACING,
  SLOT_OFFSET,
  TRASH_SLOTNAME
} from './constants'

import styles from './Deck.css'

export type LabwareComponentProps = {
  slot: DeckSlot,
  width: number,
  height: number
}

type Props = {
  className?: string,
  LabwareComponent: React.ComponentType<LabwareComponentProps>
}

// TODO(mc, 2018-02-05): this viewbox is wrong; fix it
const VIEWBOX = [
  -SLOT_OFFSET,
  -SLOT_OFFSET,
  DECK_WIDTH + SLOT_OFFSET * 2,
  DECK_HEIGHT + SLOT_OFFSET * 4
].join(' ')

export default function Deck (props: Props) {
  const {className, LabwareComponent} = props

  return (
    // TODO css not inline style on svg
    <svg viewBox={VIEWBOX} className={cx(styles.deck, className)}>

      {/* Deck outline */}
      <g transform='scale(0.666)' className={styles.deck_outline}>
        <path d='M414.541436,0.75 L20,0.75 C9.36851857,0.75 0.75,9.36851857 0.75,20 L0.75,564 C0.75,574.631481 9.36851857,583.25 20,583.25 L620,583.25 C630.631481,583.25 639.25,574.631481 639.25,564 L639.25,161.915663 C639.25,157.911598 636.004064,154.665663 632,154.665663 L432.541436,154.665663 C426.604375,154.665663 421.791436,149.852724 421.791436,143.915663 L421.791436,8 C421.791436,3.99593556 418.545501,0.75 414.541436,0.75 Z' />

        {/* Trash */}
        <g transform='translate(424 0)' className={styles.trash}>
          <rect x='0' y='0' width='216' height='152' rx='11' className={styles.trash_outer} />
          <path
            transform='translate(8 8)'
            d='M38.6180258,136 L193,136 C196.865993,136 200,132.865993 200,129 L200,7 C200,3.13400675 196.865993,1.21364172e-14 193,-8.8817842e-16 L7,8.8817842e-16 C3.13400675,1.59834986e-15 4.14730794e-16,3.13400675 8.8817842e-16,7 L0,89.9509202 C4.05812251e-16,93.2646287 2.6862915,95.9509202 6,95.9509202 L26.6180258,95.9509202 C29.9317343,95.9509202 32.6180258,98.6372117 32.6180258,101.95092 L32.6180258,130 C32.6180258,133.313708 35.3043173,136 38.6180258,136 Z'
            className={styles.trash_inner} />
          <text x='108' y='86'>TRASH</text>
        </g>
      </g>

      {/* All containers */}
      <g transform={`translate(${SLOT_OFFSET} ${SLOT_OFFSET})`}>
        {renderLabware(LabwareComponent)}
      </g>

    </svg>
  )
}

function renderLabware (LabwareComponent): React.Node[] {
  return flatMap(
    SLOTNAME_MATRIX,
    (columns: Array<DeckSlot>, row: number): React.Node[] => {
      return columns.map((slot: DeckSlot, col: number) => {
        if (slot === TRASH_SLOTNAME) return null

        const transform = `translate(${[
          SLOT_WIDTH * col + SLOT_SPACING * (col + 1),
          SLOT_HEIGHT * row + SLOT_SPACING * (row + 1)
        ].join(',')})`

        return (
          <g key={slot} transform={transform}>
            <LabwareComponent
              slot={slot}
              width={SLOT_WIDTH}
              height={SLOT_HEIGHT}
            />
          </g>
        )
      })
    })
}
