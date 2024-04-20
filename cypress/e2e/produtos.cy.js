/// <reference types="cypress"/>

describe('Testes de API - Produtos', () => {

  let token
  let produto = 'Produto EBAC ' + Math.floor(Math.random() * 100000000)
  let produtoEditado = 'Produto EBAC para ser Editado ' + Math.floor(Math.random() * 100000000)
  let produtoParaDeletar = 'Produto EBAC para ser deletado ' + Math.floor(Math.random() * 100000000)
  beforeEach(() => {
    cy.token('fulano@qa.com','teste').then(tkn => {
      token = tkn
    })
  });
    it('Deve listar produtos com sucesso - GET', () => {
      cy.request({
        method: 'GET',
        url: 'produtos'
      }).should((response) =>{
        expect(response.body).to.have.property('produtos')
        expect(response.status).to.equal(200)
      })
    })

    it('Deve cadastrar produto com sucesso - POST', () => {
      cy.cadastrarProduto(token, produto, 10, 'Notebook', 100).should((response) =>{
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
            expect(response.status).to.equal(201)
          })
        
    });

    it('Deve validar mensagem de produto cadastrado anteriormente - POST', () => {
      cy.cadastrarProduto(token, produto, 10, 'Notebook', 100).should((response) =>{
        expect(response.body.message).to.equal('Já existe produto com esse nome')
        expect(response.status).to.equal(400)
      })
    });

    it('Deve editar um produto com sucesso - PUT', () => {
      cy.cadastrarProduto(token, produtoEditado, 10, 'Produto EBAC Editado', 100)
      .then(response => {
        let id = response.body._id
        cy.request({
          method: 'PUT',
          url: `produtos/${id}`,
          headers: {authorization: token},
          body: 
          {
            "nome": produtoEditado,
            "preco": 500,
            "descricao": "Produto Editado",
            "quantidade": 100
          }
        }).should((response) =>{
          expect(response.body.message).to.equal('Registro alterado com sucesso')
          expect(response.status).to.equal(200)
        })
      })
    });

    it('Deve deletar um produto com sucesso - DELETE', () => {
      cy.cadastrarProduto(token, produtoParaDeletar, 10, 'Produto EBAC para ser deletado', 100)
      .then(response => {
        let id = response.body._id
        cy.request({
          method: 'DELETE',
          url: `produtos/${id}`,
          headers: {authorization: token},
        }).should((response) =>{
          expect(response.body.message).to.equal('Registro excluído com sucesso')
          expect(response.status).to.equal(200)
        })
      })
      
    });

  })