import Head from 'next/head';
import Image from 'next/image';

import appPreviewImg from '../assets/app-nlw-copa-preview.png';
import iconCheckImg from '../assets/icon-check.svg';
import logoImg from '../assets/logo.svg';
import usersAvatarExampleImg from '../assets/users-avatar-example.png';

export default function Home() {
  return (
    <>
      <Head>
        <title>Bolão Copa</title>
      </Head>

      <div>
        <main>
          <Image src={logoImg} alt="nlw copa" />

          <h1>Crie seu próprio bolão da copa e compartilhe entre amigos!</h1>

          <div>
            <Image
              src={usersAvatarExampleImg}
              alt="a bunch of avatars next to each other"
            />

            <strong>
              <span>+12.592</span> pessoas já usando
            </strong>
          </div>

          <form>
            <input type="text" required placeholder="Qual nome do seu bolão?" />
            <button type="submit">Criar meu bolão</button>
          </form>

          <p>
            Após criar seu bolão, você receberá um código único que poderá usar
            para convidar outras pessoas 🚀
          </p>

          <div>
            <Image src={iconCheckImg} alt="check" />
            <div>
              <span>+2.034</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div>
            <Image src={iconCheckImg} alt="check" />
            <div>
              <span>+192.847</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </main>

        <Image
          src={appPreviewImg}
          alt="Dois celulares exibindo uma prévia da aplicação móvel do nlw copa"
          quality={100}
        />
      </div>
    </>
  );
}
