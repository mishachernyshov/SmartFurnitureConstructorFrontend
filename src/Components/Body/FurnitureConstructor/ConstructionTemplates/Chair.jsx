import React, { Component } from 'react';
import image1 from './images/chair/chair1.png';
import image2 from './images/chair/chair2.png';

const Chair = () => {
    return (
        <div>
            <div>
                <img src={image1} />
            </div>
            <div>
                <img src={image1} />
            </div>
            <div>
                <img src={image2} />
                <img src={image2} />
                <img src={image2} />
            </div>
        </div>
    );
}

export default Chair;