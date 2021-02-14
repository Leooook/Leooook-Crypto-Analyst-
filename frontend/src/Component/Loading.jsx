import React from 'react'

import loadPic from '../Images/load.gif'

function Loading() {
	return (
		<section className="load">
			<img src={loadPic} className="loadPic" alt="load" />
		</section>
	)
}

export default Loading
