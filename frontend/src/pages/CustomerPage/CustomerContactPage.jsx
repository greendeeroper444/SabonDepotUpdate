import React, { useState } from 'react'
import phoneIcon from '../../assets/contact/phone-icon.png';
import emailIcon from '../../assets/contact/email-icon.png';
import '../../CSS/CustomerCSS/CustomerContact.css';
import emailjs from 'emailjs-com';
import toast from 'react-hot-toast'

function CustomerContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState('');

    const handleInputChange = (e) => {
        const {id, value} = e.target;
        setFormData({...formData, [id]: value});
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const loadingToast = toast.loading('Sending message...');
        
        //template params to match email js template
        const templateParams = {
            from_name: formData.name,
            from_email: formData.email,
            message: formData.message,
            reply_to: formData.email, 
            to_name: 'Sabon Depot',
        };

        emailjs.send(
            'service_bh8abvt',//service id from email js
            'template_xssa40y', //template id from email js
            templateParams,
            'IQslrKfwSpuXzMa-_'  //email js public key
        ).then((response) => {
            console.log('SUCCESS!', response.status, response.text);
            toast.success('Message sent successfully!', {
                id: loadingToast,
            });
            setFormData({ 
                name: '', 
                email: '', 
                message: '' 
            }); 
        }).catch((error) => {
            console.log('FAILED...', error);
            toast.error('Failed to send message. Please try again later.', {
                id: loadingToast,
            });
        });
    };

  return (
    <div className='customer-contact-container'>
        <div className='customer-contact-content'>
            <form action="" className='customer-contact-form' onSubmit={handleSubmit}>
                <h2 className='customer-contact-header'>Get in <span style={{ color: '#077A37' }}>Touch</span></h2>
                <p className='welcome-message'>For More Information About Our Product & Services. Please Feel Free To Drop Us An Email. Our Staff Always Be There To Help You Out. Do Not Hesitate!</p>

                <div className='form-group'>
                    <input type='name' className='form-input' id='name' placeholder='Name' value={formData.name} onChange={handleInputChange} />
                </div>

                <div className='form-group'>
                    <input type='email' className='form-input' id='email' placeholder='Email' value={formData.email} onChange={handleInputChange} />
                </div>

                <div className='form-group'>
                    <textarea type='message' className='form-textarea' id='message' placeholder='Send us a message/comments' value={formData.message} onChange={handleInputChange} />
                </div>

                <button type='submit' className='customer-contact-button-submit'>SEND</button>

                {status && <p className='status-message'>{status}</p>}

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