import React from 'react'
import PropTypes from 'prop-types'
import styles from '../css/style.css'

import Button from './Button.js'

const makeInputField = ({setSubstate, getSubstate}) => ({accessor, ...otherProps}) => {
  return <input
    id={accessor}
    value={getSubstate(accessor) || ''} // getSubstate = (inputKey) => stateOfThatKey
    onChange={e => setSubstate(accessor, e.target.value)} // setSubstate = (inputKey, inputValue) => {...}
    {...otherProps}
  />
}

class IngredientPropertiesForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      input: {
        name: this.props.name || null,
        volume: this.props.volume || null,
        description: this.props.description || null
      }
    }

    this.Field = makeInputField({
      setSubstate: (inputKey, inputValue) => {
        console.log({inputKey, inputValue})
        this.setState({input: {...this.state.input, [inputKey]: inputValue}})
      },
      getSubstate: inputKey => this.state.input[inputKey]
    })
  }

  componentWillReceiveProps (nextProps) {
    const { name, volume, description } = this.state.input
    this.setState({
      input: {
        name: nextProps.name || name,
        volume: nextProps.volume || volume,
        description: nextProps.description || description
      }
    })
  }

  render () {
    const { numWellsSelected, onSave, onCancel } = this.props
    const Field = this.Field // ensures we don't lose focus on input re-render during typing

    return (
      <div className={styles.ingredientPropertiesEntry}>
        <h1>
          <div>Ingredient Properties</div>
          <div>{numWellsSelected} Well(s) Selected</div>
        </h1>
        <form>
          <span>
            <label>Name</label>
            <Field accessor='name' />
          </span>
          <span>
            <label>Volume</label> (µL)
            <Field accessor='volume' />
          </span>
          <span>
            <label>Description</label>
            <Field accessor='description' />
          </span>
        </form>
        <div className={styles.ingredientPropRightSide}>
          {/* <span>
            <label>Color Swatch</label>
            <div className={styles.circle} style={{backgroundColor: 'red'}} />
          </span> */}
          <Button disabled={numWellsSelected <= 0} onClick={e => onSave(this.state.input)}>Save</Button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    )
  }
}

IngredientPropertiesForm.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  numWellsSelected: PropTypes.number.isRequired,

  name: PropTypes.string,
  volume: PropTypes.number,
  description: PropTypes.string
}

export default IngredientPropertiesForm
