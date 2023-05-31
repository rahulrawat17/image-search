import React from 'react'

const ExtendedImgView = (props) => {
	return (
		<div className="image-popup-container"
			onClick={props.closeImg}
		>
			<img
				className="popup-image"
				src={props.src}
				alt=""
				style={{ marginTop: "140px" }}
				onClick={props.closeImg}
			/>
		</div>
	)
}

export default ExtendedImgView