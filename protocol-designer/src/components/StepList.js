// @flow
import * as React from 'react'
import isNil from 'lodash/isNil'
import pick from 'lodash/pick'
import {SidePanel, TitledList} from '@opentrons/components'

import {END_STEP} from '../steplist/types'
import type {StepItemData, StepSubItemData, StepIdType, SubstepIdentifier} from '../steplist/types'

import StepItem from '../components/StepItem'
import TransferishSubstep from '../components/TransferishSubstep'
import StepCreationButton from '../containers/StepCreationButton'

type StepIdTypeWithEnd = StepIdType | typeof END_STEP

type StepListProps = {
  selectedStepId: StepIdTypeWithEnd | null,
  hoveredSubstep: SubstepIdentifier,
  steps: Array<StepItemData & {substeps: StepSubItemData}>,
  handleSubstepHover: SubstepIdentifier => mixed,
  handleStepItemClickById?: (StepIdTypeWithEnd) => (event?: SyntheticEvent<>) => mixed,
  handleStepItemCollapseToggleById?: (StepIdType) => (event?: SyntheticEvent<>) => mixed,
  handleStepHoverById?: (StepIdTypeWithEnd | null) => (event?: SyntheticEvent<>) => mixed,
}

function generateSubstepItems (substeps, onSelectSubstep, hoveredSubstep) {
  if (!substeps) {
    // no substeps, form is probably not finished (or it's "deck-setup" stepType)
    return null
  }

  if (substeps.stepType === 'transfer' ||
    substeps.stepType === 'consolidate' ||
    substeps.stepType === 'distribute'
  ) {
    // all these step types share the same substep display
    return <TransferishSubstep
      substeps={substeps}
      hoveredSubstep={hoveredSubstep}
      onSelectSubstep={onSelectSubstep} // TODO use action
    />
  }

  if (substeps.stepType === 'pause') {
    // TODO: style pause stuff
    if (substeps.waitForUserInput) {
      return <li>{substeps.message}</li>
    }
    const {hours, minutes, seconds} = substeps
    return <li>{hours} hr {minutes} m {seconds} s</li>
  }

  return <li>TODO: substeps for {substeps.stepType}</li>
}

export default function StepList (props: StepListProps) {
  return (
    <SidePanel
      title='Protocol Step List'
      onMouseLeave={props.handleStepHoverById && props.handleStepHoverById(null)}
    >
      {props.steps && props.steps.map((step, key) => (
        <StepItem key={key}
          onClick={props.handleStepItemClickById && props.handleStepItemClickById(step.id)}
          onMouseEnter={props.handleStepHoverById && props.handleStepHoverById(step.id)}
          onCollapseToggle={
            (step.stepType === 'deck-setup' || !props.handleStepItemCollapseToggleById)
              ? null // Deck Setup steps are not collapsible
              : props.handleStepItemCollapseToggleById(step.id)
          }
          selected={
            props.hoveredSubstep === null && // don't show selected border on the Step when there's a Substep being hovered
            !isNil(props.selectedStepId) && step.id === props.selectedStepId
          }
          {...pick(step, [
            'title',
            'stepType',
            'sourceLabwareName',
            'sourceWell',
            'destLabwareName',
            'destWell',
            'description',
            'collapsed'
          ])}
        >
          {generateSubstepItems(step.substeps, props.handleSubstepHover, props.hoveredSubstep)}
        </StepItem>
      ))}

      <StepCreationButton />
      <TitledList title='END' iconName='check'
        onClick={props.handleStepItemClickById && props.handleStepItemClickById(END_STEP)}
        onMouseEnter={props.handleStepHoverById && props.handleStepHoverById(END_STEP)}
        selected={props.selectedStepId === END_STEP}
      />
    </SidePanel>
  )
}
