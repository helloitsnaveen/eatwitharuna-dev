import { Magic } from 'magic-sdk';
import { useState, useEffect } from 'react';

import s from 'styles/login.module.scss';
import Navbar from 'components/Navbar/Navbar';

const Join = () => {
    const [magic, setMagic] = useState(null);
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        !magic &&
            setMagic(
                new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY)
            );
        magic?.preload();
    }, [magic]);
        
  async function handleLoginWithEmail(email) {
		try {
			setDisabled(true); // disable login button to prevent multiple emails from being triggered
			let didToken = await magic.auth.loginWithMagicLink({
				email,
				redirectURI: `${process.env.NEXT_PUBLIC_SERVER_URL}/callback`,
			});
			authenticateWithServer(didToken);
		} catch (error) {
			setDisabled(false); // re-enable login button - user may have requested to edit their email
			console.log(error);
		}
    }
    
    async function authenticateWithServer(didToken) {
        const res = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + didToken,
            },
        });
        res.status === 200 && Router.push("/");
    }

    return (
			<>
				<Navbar />

				<div className={s["login"]}>
					<span className={s["login-text"]}>login/register</span>
					<div className={s["login__main"]}>
                        <span className={s["login__main-instructions"]}>
                            register or log in via the link emailed to you! 
                        </span>

							<input
								className={s["login__main-input"]}
								type="email"
								placeholder="please enter your email"
							></input>

					</div>
				</div>
			</>
		);
}

export default Join;