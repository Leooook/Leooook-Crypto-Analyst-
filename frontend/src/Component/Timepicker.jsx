import React, { Component } from 'react'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'

class Timepicker extends Component {
	state = {
		from: new Date(),
		to: new Date(),
		curr: new Date()
	}

	componentDidUpdate() {
		// Get the date range and setstate
		if (this.props.date !== undefined && new Date(this.props.date.from).getTime() !== this.state.from.getTime()) {
			const { from, to } = this.props.date
			this.setState({ from: new Date(from), to: new Date(to), curr: new Date(to) })
		}
	}

	// appendzero for date eg. 2019-12-2 -> 2019-12-02
	appendzero = (obj) => {
		if (obj < 10) return '0' + obj
		else return obj
	}

	// transform date type to string
	fromatDate = (date) => {
		const year = date.getFullYear()
		const month = this.appendzero(date.getMonth() + 1)
		const day = this.appendzero(date.getDate())
		return String([ year, month, day ].join('-'))
	}

	// get curr date
	setDate = (date) => {
		this.setState({ curr: date })
		this.props.changeDate(this.fromatDate(date))
	}

	customInput = React.forwardRef(({ value, onClick }, ref) => (
		<button className="custom-input" ref={ref} onClick={onClick}>
			{value}
		</button>
	))

	render() {
		return (
			<DatePicker
				selected={this.state.curr}
				minDate={this.state.from}
				maxDate={this.state.to}
				dateFormat={'dd/MM/yyyy'}
				onChange={(date) => this.setDate(date)}
				customInput={<this.customInput />}
			/>
		)
	}
}

export default Timepicker
