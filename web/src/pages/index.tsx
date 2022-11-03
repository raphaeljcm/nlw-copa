import { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { FormEvent, useRef } from 'react';
import { toast } from 'react-toastify';

import appPreviewImg from '../assets/app-nlw-copa-preview.png';
import iconCheckImg from '../assets/icon-check.svg';
import logoImg from '../assets/logo.svg';
import usersAvatarExampleImg from '../assets/users-avatar-example.png';
import { api } from '../lib/axios';

interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home({ poolCount, guessCount, userCount }: HomeProps) {
  const poolTitle = useRef<HTMLInputElement>(null);

  async function createPool(event: FormEvent) {
    event.preventDefault();

    try {
      if (poolTitle.current) {
        const response = await api.post('pools', {
          title: poolTitle.current.value,
        });

        const { code } = response.data;

        await navigator.clipboard.writeText(code);
        toast.success(
          'Bolão criado! O código foi copiado para a área de transferencia.',
        );
        poolTitle.current.value = '';
      }
    } catch (e) {
      toast.error('Ocorreu um erro, tente novamente!');
    }
  }

  return (
    <>
      <Head>
        <title>Bolão Copa</title>
      </Head>

      <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
        <main>
          <Image src={logoImg} alt="nlw copa" quality={100} />

          <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
            Crie seu próprio bolão da copa e compartilhe entre amigos!
          </h1>

          <div className="mt-10 flex items-center gap-2">
            <Image
              src={usersAvatarExampleImg}
              alt="a bunch of avatars next to each other"
            />

            <strong className="text-gray-100 text-xl">
              <span className="text-ignite-500">+{userCount}</span> pessoas já
              usando
            </strong>
          </div>

          <form onSubmit={createPool} className="mt-10 flex gap-2">
            <input
              className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
              type="text"
              required
              placeholder="Qual nome do seu bolão?"
              ref={poolTitle}
            />
            <button
              className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700"
              type="submit"
            >
              Criar meu bolão
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-300 leading-relaxed">
            Após criar seu bolão, você receberá um código único que poderá usar
            para convidar outras pessoas 🚀
          </p>

          <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
            <div className="flex items-center gap-6">
              <Image src={iconCheckImg} alt="check" quality={100} />
              <div className="flex flex-col">
                <span className="font-bold text-2xl">+{poolCount}</span>
                <span>Bolões criados</span>
              </div>
            </div>

            <div className="w-px h-14 bg-gray-600" />

            <div className="flex items-center gap-6">
              <Image src={iconCheckImg} alt="check" quality={100} />
              <div className="flex flex-col">
                <span className="font-bold text-2xl">+{guessCount}</span>
                <span>Palpites enviados</span>
              </div>
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

export const getStaticProps: GetStaticProps = async () => {
  const [poolCountResponse, guessCountResponse, userCountResponse] =
    await Promise.all([
      api.get('pools/count'),
      api.get('guesses/count'),
      api.get('users/count'),
    ]);

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
    revalidate: 10 * 1000 * 5,
  };
};
