import { useEffect } from "react";
import api from './../services/api.js';
import { GetStaticProps } from 'next';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';


type Episode = {
  id: number,
  title: string,
  member: string,
  published_at: string
}

type HomeProps = {
  episodes: Episode[]
}

export default function Home(props: HomeProps) {
  return (
    <div>
      <h1>Index</h1>
      <p>{JSON.stringify(props.episodes)}</p>
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

  return {
    props: {
      episodes: episodes
    },
    // revalidade consegue controlar a quantidade 
    // de requisição de atualização que a pagina se atualizara por dia,
    //  recebe um numero em segundos de quanto em quanto tempo a apagina vai ser atualizada
    revalidate: 60 * 60 * 8,
  }
}
