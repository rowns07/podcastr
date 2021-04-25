import { useContext, useEffect } from "react";
import api from './../services/api.js';
import { GetStaticProps } from 'next';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
import styles from './home.module.scss';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { PlayerContext } from "../context/PlayerContext";


type Episode = {
  id: number,
  title: string,
  thumbnail: string,
  description: string,
  members: string,
  duration: number,
  durationAsString: string,
  url: string;
  publishedAt: string
}

type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  const router = useRouter();
  const { play } = useContext(PlayerContext);
  return (
    <div className={styles.homePage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {latestEpisodes.map(episode => {
            return (
              <li key={episode.id}>
                <Image
                  width={192}
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit="cover"
                />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button" onClick={() => play(episode)}>
                  <img src="/play-green.svg" alt="Tocar Episodio" />
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>

        <h2>Todos os Episodios</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map(episode => {
              return (
                <tr key={episode.id}>
                  <td style={{ width: 72 }}>
                    <Image src={episode.thumbnail}
                      alt="Tocar Podcast"
                      width={120}
                      height={120}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>
                        {episode.title}
                      </a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 100 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button">
                      <img src="./play-green.svg"
                        alt="Tocar Podcast"
                      />
                    </button>
                  </td>
                </tr>
              )

            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}

// // SSG --- Só funciona em produção..
export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('/episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(response => {
    return {
      id: response.id,
      title: response.title,
      thumbnail: response.thumbnail,
      members: response.members,
      publishedAt: format(parseISO(response.published_at), 'd MMM yy', { locale: ptBR }),
      description: response.description,
      durationAsString: convertDurationToTimeString(Number(response.file.duration)),
      url: response.file.url,
    };
  })

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    // revalidade consegue controlar a quantidade 
    // de requisição de atualização que a pagina se atualizara por dia,
    //  recebe um numero em segundos de quanto em quanto tempo a apagina vai ser atualizada
    revalidate: 60 * 60 * 8,
  }
}
