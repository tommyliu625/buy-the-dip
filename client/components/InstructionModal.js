import React, { useState } from 'react';
import Modal from 'react-modal';

let height = Math.floor(window.innerHeight / 1.78);
let width = Math.floor(window.innerWidth / 2.75);

const customStyles = {
  content: {
    top: `${height}px`,
    left: `${width}px`,
    right: 'auto',
    bottom: 'auto',
    // marginRight: '-50%',
    transform: 'translate(-20%, -70%)',
    zIndex: 3,
    height: '700px',
    width: '800px',
  },
};

export default function InstructionModal() {
  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }

  return (
    <div id='instruction-div'>
      <button id='instruction-button' onClick={() => setIsOpen(true)}>
        Click Here For Instructions
      </button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={() => setIsOpen(false)}
        style={customStyles}
        contentLabel='Example Modal'
        ariaHideApp={false}
      >
        <button
          id='close-button'
          onClick={() => setIsOpen(false)}
          style={{ float: 'right' }}
        >
          Close
        </button>
        <h2 style={{ textAlign: 'center' }}>Instructions</h2>
        <div>
          <p>1. Select a stock ticker.</p>
          <img src='Step1-SubmitTicker.png' width='350px' />
        </div>
        <div>
          <p>
            2. Submit your parameters. By default, the parameters are set to
            find 20% dips within a 5 day period. After parameters are set, you
            can filter dips by date.
          </p>
          <img src='Step2-SubmitParameters.png' width='450px' />
        </div>
        <div>
          <p>3. Adds dips to the staging area</p>
          <img src='Step3-AddDip.png' width='450px' />
        </div>
        <div>
          <p>4. For each dip, input a number of shares and cost per share</p>
          <img src='Step4-ChangeInputCost.png' width='450px' />
        </div>
        <div>
          <p>
            5. Calculate returns. Now you can see your rate of returns and total
            returns if you would have bought the dip!
          </p>
          <img src='Step5-CalculateReturns.png' width='450px' />
        </div>
      </Modal>
    </div>
  );
}
