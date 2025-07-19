import fetch from 'node-fetch';

const url = 'http://localhost:5000/api/products/6877764c14f3213dcf16d634';

const updatedData = {
  name: 'Nome atualizado via fetch',
  price: 500,
  description: 'Produto atualizado com sucesso',
  author: 'Ricardo Atualizado'
};

fetch(url, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(updatedData)
})
  .then(async (res) => {
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      console.log('✅ Sucesso:', json);
    } catch (e) {
      console.error('⚠️ Resposta inesperada (HTML?):\n', text);
    }
  })
  .catch(console.error);
