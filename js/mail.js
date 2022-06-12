function sendEmail(
    sender = 'akashkadirvel@yandex.com', 
    name = 'Guest',
    phone = '',
    message = ''
) {
	Email.send({
        To: sender,
        Host : "smtp.yandex.com",
        Username : "akashkadirvel",
        Password : "lpxlzqmoxuotsvym",
        Bcc : `akashkadirvel@gmail.com`,
        From : "akashkadirvel@yandex.com",
        Subject : `New Message from ${name} thru portfolio`,
        Body : `<html>
                    <p><b>Email </b>: ${sender}</p>
                    <p><b>Name </b>: ${name}</p>
                    <p><b>Phone </b>: ${phone}</p>
                    <p><b>Message </b>: ${message}</p><br />
                    <p> 
                        Thanks for your interest.
                        I received your message from my portfolio. 
                        You will receive call shortly from me regarding your message.
                    </p><br />
                    <p>Thanks and Regards,</p>
                    <p>Akash Kadirvel</p>
                </html>`
    }).then(
        message => {
            if(message == 'OK')
                alert('Mail sent successfully');
            else {
                alert(message);
            }
        }
    );
}