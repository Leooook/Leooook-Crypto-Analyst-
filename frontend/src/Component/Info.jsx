import React, { Component } from 'react'
import { AiOutlineCaretDown, AiOutlineCaretUp } from 'react-icons/ai'

import Loading from './Loading.jsx'
import Timepicker from './Timepicker.jsx'

import bitcoin from '../Images/bitcoin.svg'
import bitcoin_cash from '../Images/bitcoin-cash.svg'
import bnb from '../Images/bnb.svg'
import cardano from '../Images/cardano.svg'
import eos from '../Images/eos.svg'
import ethereum from '../Images/ethereum.svg'
import litecoin from '../Images/litecoin.svg'
import stellar from '../Images/stellar.svg'
import tether from '../Images/tether.svg'
import tezos from '../Images/tezos.svg'
import xrp from '../Images/xrp.svg'

// logos
const icons = {
	bitcoin: bitcoin,
	'bitcoin-cash': bitcoin_cash,
	bnb: bnb,
	cardano: cardano,
	eos: eos,
	ethereum: ethereum,
	litecoin: litecoin,
	stellar: stellar,
	tether: tether,
	tezos: tezos,
	xrp: xrp
}

class Info extends Component {
	state = {
		url: 'http://127.0.0.1:5000/',
		data: undefined,
		date: undefined,
		time: 'default',
		method: '/Average',
		sort: 'Price',
		down: true,
		icons: [ ...[ 'show' ], ...[ ...Array(7).fill('not-show') ] ],
		header: new Headers({
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'text/plain'
		})
	}

	// fetch the initial data from backend
	componentDidMount() {
		fetch(this.state.url, {
			method: 'GET',
			headers: this.state.header,
			mode: 'cors'
		})
			.then((response) => response.json())
			.then((data) => {
				this.setState({ data })
			})
			.catch((error) => {
				console.error('Error:', error)
			})
		fetch(this.state.url + 'Date', {
			method: 'GET',
			headers: this.state.header,
			mode: 'cors'
		})
			.then((response) => response.json())
			.then((date) => {
				this.setState({ date })
			})
			.catch((error) => {
				console.error('Error:', error)
			})
	}

	// if change the date then fetch the new data
	changeDate = (time) => {
		fetch(this.state.url + time + this.state.method, {
			method: 'GET',
			headers: this.state.header,
			mode: 'cors'
		})
			.then((response) => response.json())
			.then((data) => {
				this.setState({ data, time })
			})
			.catch((error) => {
				console.error('Error:', error)
			})
	}

	// if change the sort then fetch the new data
	changeSort = (sort, number) => {
		let down = true
		if (this.state.sort === sort) {
			down = !this.state.down
			this.setState({ down })
		} else {
			this.setState({ sort, down })
		}
		this.setState({ data: Object.values(this.state.data).sort(this.compare(this.state.sort, this.state.down)) })

		let num
		if (down === true) {
			num = number * 2
		} else {
			num = number * 2 + 1
		}
		this.setState({
			icons: [ ...[ ...Array(num).fill('not-show') ], ...[ 'show' ], ...[ ...Array(7 - num).fill('not-show') ] ]
		})
	}

	// compare function for sort
	compare = (value, type) => {
		return (x, y) => {
			let a, b
			if (x[value] === 'NA' && y[value] === 'NA') {
				return 0
			} else if (x[value] === 'NA') {
				return 1
			} else if (y[value] === 'NA') {
				return -1
			} else {
				a = parseFloat(x[value])
				b = parseFloat(y[value])
			}
			if (type) {
				return b - a
			} else {
				return a - b
			}
		}
	}

	processFont = (font) => {
		return font.replace('-', ' ')
	}

	processNum = (num) => {
		if (num === 'NA') {
			return 'No Data'
		} else {
			return num
		}
	}

	// get red and blue css color
	getColor = (num) => {
		if (num === 'NA' || num === '0.000%') {
			return 'data-font-grey'
		} else if (parseFloat(num) > 0) {
			return 'data-font-green'
		} else {
			return 'data-font-red'
		}
	}

	// handle event change
	handleChange = (event) => {
		const method = '/' + event.target.value

		fetch(this.state.url + this.state.time + method, {
			method: 'GET',
			headers: this.state.header,
			mode: 'cors'
		})
			.then((response) => response.json())
			.then((data) => {
				this.setState({ data, method })
			})
			.catch((error) => {
				console.error('Error:', error)
			})
	}

	render() {
		// process data, tranform to array and sort
		if (this.state.data !== undefined) {
			var value = Object.values(this.state.data).sort(this.compare(this.state.sort, this.state.down))
			console.log(value)
		}
		return (
			<div className="info">
				<section className="option-part">
					<label className="price-method" htmlFor="method">
						Choose Price Types:
					</label>
					<select className="method" onChange={this.handleChange}>
						<option value="Average">Average</option>
						<option value="Open">Open</option>
						<option value="Close">Close</option>
						<option value="High">High</option>
						<option value="Low">Low</option>
					</select>
					<Timepicker date={this.state.date} changeDate={this.changeDate} />
				</section>
				<section>
					{value === undefined ? (
						<Loading />
					) : (
						<div className="data-part">
							<div className="data-title">
								<p className="data-font data1">No.</p>
								<p className="data-font data2">Coin</p>
								<div
									className="data-font data-font-click data3"
									onClick={() => this.changeSort('Price', 0)}
								>
									Price
									<AiOutlineCaretDown className={`${this.state.icons[0]}`} />
									<AiOutlineCaretUp className={`${this.state.icons[1]}`} />
								</div>
								<div
									className="data-font data-font-click data4"
									onClick={() => this.changeSort('Yesterday', 1)}
								>
									24h
									<AiOutlineCaretDown className={`${this.state.icons[2]}`} />
									<AiOutlineCaretUp className={`${this.state.icons[3]}`} />
								</div>
								<div
									className="data-font data-font-click data4"
									onClick={() => this.changeSort('Aweek', 2)}
								>
									7d
									<AiOutlineCaretDown className={`${this.state.icons[4]}`} />
									<AiOutlineCaretUp className={`${this.state.icons[5]}`} />
								</div>
								<div
									className="data-font data-font-click data4"
									onClick={() => this.changeSort('Amonth', 3)}
								>
									1m
									<AiOutlineCaretDown className={`${this.state.icons[6]}`} />
									<AiOutlineCaretUp className={`${this.state.icons[7]}`} />
								</div>
								<p className="data-font data5">24h Volume</p>
								<p className="data-font data5">Market Cap</p>
							</div>
							{value.map((each, key) => (
								<section className="data" key={key}>
									<p className="data-font-num data-font data1">{key}</p>
									<div className="data2">
										<img className="data-icons" src={icons[each.Currency]} alt="icons" />
										<p className="data-font-name">{this.processFont(each.Currency)}</p>
									</div>
									<p className="data-font-num data3">${each.Price}</p>
									<p className={`data-font-num data4 ${this.getColor(each.Yesterday)}`}>
										{this.processNum(each.Yesterday)}
									</p>
									<p className={`data-font-num data4 ${this.getColor(each.Amonth)}`}>
										{this.processNum(each.Amonth)}
									</p>
									<p className={`data-font-num data4 ${this.getColor(each.Aweek)}`}>
										{this.processNum(each.Aweek)}
									</p>
									<p className="data-font-num data5">${each.Volume}</p>
									<p className="data-font-num data5">${each['Market Cap']}</p>
								</section>
							))}
						</div>
					)}
				</section>
			</div>
		)
	}
}

export default Info
