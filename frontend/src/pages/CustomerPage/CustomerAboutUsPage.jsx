import React from 'react'
import ourVisionMission from '../../assets/aboutus/vision-mission-frame.png';
import backgroundAboutUs from '../../assets/aboutus/about-us-background.png';
import '../../CSS/CustomerCSS/CustomerAboutUs.css'

function CustomerAboutUsPage() {
  return (
    <div className='customer-about-us-container'>
        <div className='customer-about-us-content'>
            <div className='vision-mission-content'>
                <div className='our-vision'>
                    <h1>Our Vision</h1>
                    <img src={ourVisionMission} alt="Our Vision" />
                    <p>To be the country’s leading local manufacturer in 2025 of safe, efficient and quality but affordable cleaning solutions for local and international market with a strong commitment to value of ecological sustainability through innovative product development by a motivated and excellence – driven workforce adhering to strong values of good corporate governance.</p>
                </div>
                <div className='our-mission'>
                    <h1>Our Vision</h1>
                    <img src={ourVisionMission} alt="Mission Vision" />
                    <p>To provide high quality and affordable cleaning solutions and innovative products. To meet customers’ satisfaction in our high-quality products. To promote eco-friendly products that makes use of refilling and re-using of plastic containers. And to observe continuous product research and development and manufacture efficient products using branded chemicals that does not harm the environment. To develop an organization that harnesses a motivated and equipped workforce which gives recognition to employees’ skills and competency, thus further develop loyalty to the company’s continuous growth and development.</p>
                </div>
            </div>

            <div className='background-image-content'>
                <div className='background-image'>
                    <img src={backgroundAboutUs} alt="" />
                </div>
            </div>
        </div>
    </div>
  )
}

export default CustomerAboutUsPage