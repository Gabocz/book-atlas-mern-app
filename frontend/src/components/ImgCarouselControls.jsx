import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'



function ImgCarouselControls({ currentImgIdx, setCurrentImgIdx, numOfImgs}) {
  
  
  const handleLeftClick = () => {
    if(currentImgIdx > 0) {
      setCurrentImgIdx(prev => {
        return prev - 1
      })
      }
    }
   
  const handleRightClick = () => {
    if(currentImgIdx >= numOfImgs - 1 ) {
      return
      }
      setCurrentImgIdx(currentImgIdx + 1)
    }

    return (
        <div className="field has-addons is-flex is-justify-content-center">
        <p className="control">
          <button 
            onClick={handleLeftClick} 
            className="button is-responsive"
            disabled={currentImgIdx === 0}
          >
            <FaArrowLeft/>
          </button>
        </p>
        <p className="control">
          <button 
            onClick={handleRightClick} 
            className="button is-responsive"
            disabled={currentImgIdx === numOfImgs - 1}
          >
            <FaArrowRight/>
          </button>
        </p>
      </div>
    )
}

export default ImgCarouselControls
