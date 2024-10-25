import { useQuery } from 'react-query';
import './App.css';
import styled from 'styled-components';
import { useState } from 'react';

const AnimeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const AnimeCard = styled.div`
  background-color: #333;
  color: white;
  padding: 15px;
  border-radius: 8px;
  width: 200px;
`;

const FilterContainer = styled.div`
  margin-bottom: 20px;
`;

function App() {
  const [filter, setFilter] = useState('');

  // Consulta para buscar os dados uma vez e armazená-los em cache
  const { data, error, isLoading } = useQuery('animes', fetchAnimes, {
    staleTime: 1000 * 60 * 5, // os dados permanecerão frescos por 5 minutos
  });

  async function fetchAnimes() {
    const response = await fetch('https://api.jikan.moe/v4/top/manga');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.data; // retorna todos os dados
  }

  // Filtra os dados em memória
  const filteredData = data?.filter((anime: { title: string; }) => 
    anime.title.toLowerCase().includes(filter.toLowerCase())
  ) || [];

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <FilterContainer>
        <input 
          type="text" 
          placeholder="Filtrar por título" 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)} 
        />
      </FilterContainer>
      <AnimeContainer>
        {filteredData.map((anime) => (
          <AnimeCard key={anime.id}>
            <img src={anime.images.jpg.image_url} alt={anime.title} style={{ width: '100%' }} />
            <h3>{anime.title}</h3>
          </AnimeCard>
        ))}
      </AnimeContainer>
    </div>
  );
}

export default App;
