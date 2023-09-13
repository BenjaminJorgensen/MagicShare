/* ImageManager */
/* Manages adding removing and creating images */

import colours from './colours.json';
import { v4 as uuidv4 } from 'uuid';
import { sampleImages } from './fakeNetworkData.js';
let sampleImageCount = 0;
const dict = new Object();

const deathAnimation = {
	animation: "0.5 death ease"
}


/* TODO:
	* When images are added, map the userId to the correct colour, otherwise assign one
	* Discuss the positioning algorithm at some point
	
	ImgPacket template:
	imgPacket = {
		userId:		//ID belong to the clients IP adress
		userName:	//Handle for the IP, [NOT USED FOR IDENTIFICATION]
		imgName:	//Filename of the image
		imgPayload: //ArrayBuffer format
		imgType:	//ImgType eg. PNG JPEG
	}
*/

/* addImage()
	* -------------------------------------------------------
	*  Adds an image to the images array. App.jsx will dynamicaly
	*  render the display manager based on the contents of the images array.
	*  Currently assigns a random colour to the img. --Change this behaviour
	*
	*  imgPacket:
	*		An object with all the information about an image.
	*	setImages():
	*		React hook that updates the images array.
	*/
export function addImage(imgPacket, { setImages }) {
	console.log(imgPacket.imgId);

	//Append the colour to the image packet
	if (dict.hasOwnProperty(imgPacket.userId)) {
		Object.assign(imgPacket, { style: dict[imgPacket.userId] })
	} else {
		dict[imgPacket.userId] = colours[Object.keys(dict).length % 5];
		Object.assign(imgPacket, { style: dict[imgPacket.userId] });
	}

	//Update the image state array
	//Current images as an argument so it doesn't overwrite itself
	setImages((currentImages) => {
		return [...currentImages, { id: imgPacket.imgId, data: imgPacket },]
	})
}

/* addTestImage()
	* -------------------------------------------------------
	*  Adds a preselected image from the harddrive to the images array. 
	*  This is used for testing animations and the dynamic layout of the display manager
	*  Usually extivated by [SPACE] key
	*
	*   images:
	*		An array of images that are to be rendered to the screen
	*	setImages():
	*		React hook that updates the images array.
	*/
export function addTestImage({ setImages }) {

	//Copy image from the sample images
	const image = { ...sampleImages[sampleImageCount++ % sampleImages.length] };

	//Adds an image ID [Warning could pontentially conflict with network imgages]
	image.imgId = sampleImageCount;
	//Add this image
	addImage(image, { setImages })
}

/* removeUser()
	* -------------------------------------------------------
	*  Removes all images belonging to a certain userId from the display.
	*
	*   userId:
	*		The userId to be removed from the display
	*	setImages():
	*		React hook that updates the images array.
	*/
export function removeUser(userId, { setImages }) {
	//Run the death animation
	setImages((currentImages) => {
		//Run the death Animation
		currentImages.map((image) => {
			image.style = deathAnimation;
			console.log("played animation")
		})

		return currentImages.filter((image) => image.data.userId !== userId)
	})
}

/* removeImage()
	* -------------------------------------------------------
	*  Removes an image from the display with the given imgId
	*
	*   imgId:
	*		The id of the image to be removed
	*	setImages():
	*		React hook that updates the images array.
	*/
export function removeImage(imgId, { setImages }) {
	console.log("clear image");
	setImages((currentImages) => {
		return currentImages.filter((image) => image.id !== imgId)
	})
}

/* removeUser()
	* -------------------------------------------------------
	*  Removes all images from the display
	*
	*	setImages():
	*		React hook that updates the images array.
	*/
export function removeAllImages({ images, setImages }) {
	images.map(image => {
		setTimeout(() => {
			removeImage(image.id, {setImages});
		}, 500);
	});
	playDeathAnimation({setImages});
}

function playDeathAnimation({setImages}) {
	setImages((currentImages) => {
		return currentImages.map((image) => {
			let style = Object.assign({}, image.data.style);
			Object.assign(style, { 
				animation: "0.5s death ease", 
				animationFillMode: "forwards",
			});
			image.data.style = style;
			return image;
		});
	})
}