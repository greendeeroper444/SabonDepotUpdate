import React from 'react'
import phoneIcon from '../../assets/contact/phone-icon.png';
import emailIcon from '../../assets/contact/email-icon.png';
import '../../CSS/CustomerCSS/CustomerContact.css'

function CustomerContactPage() {
  return (
    <div className='customer-contact-container'>
        <div className='customer-contact-content'>
            <form action="" className='customer-contact-form'>
                <h2 className='customer-contact-header'>Get in <span style={{ color: '#077A37' }}>Touch</span></h2>
                <p className='welcome-message'>For More Information About Our Product & Services. Please Feel Free To Drop Us An Email. Our Staff Always Be There To Help You Out. Do Not Hesitate!</p>

                <div className='form-group'>
                    <input type='name' className='form-input' id='name' placeholder='Name' />
                </div>

                <div className='form-group'>
                    <input type='email' className='form-input' id='email' placeholder='Email' />
                </div>

                <div className='form-group'>
                    <textarea type='message' className='form-textarea' id='message' placeholder='Send us a message/comments' />
                </div>

                <button type='submit' className='customer-contact-button-submit'>SEND</button>

                <div className='customer-contact-number-email'>
                    <div className='phone'>
                        <img src={phoneIcon} alt="Phone Number" />
                        <div className='phone-content'>
                            <h6>PHONE</h6>
                            <span>0951 958 1616</span>
                        </div>
                    </div>

                    <div className='email'>
                        <img src={emailIcon} alt="Email" />
                        <div className='email-content'>
                            <h6>EMAIL</h6>
                            <span>sabondepotmindanao@gmail.com</span>
                        </div>
                    </div>
                </div>
            </form>

            <div className='map-section'>
                <div className='gmap-frame'>
                    <iframe width="400" height="500" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?width=400&amp;height=500&amp;hl=en&amp;q=Service%20Rd,%20Panabo,%20Davao%20del%20Norte+(Sabon%20Depot)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"><a href="https://www.gps.ie/">gps trackers</a></iframe>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CustomerContactPage