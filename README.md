# PGCLab
O PGCLab é uma ferramenta desenvolvida para o estudo e aplicação de técnicas de geração procedural de conteúdo, utilizando apenas ferramentas abertas para web. Entre as principais aplicações estão os jogos digitais digitais.

O PGCLab foi desenvolvido durante 2020, como um projeto da disciplina DCC104 e DCC138 e, posteriormente, como iniciação científica por [Lucas Diniz Costa](https://github.com/lucasdinizcosta) sob a orientação de [Igor Knop](https://github.com/igorknop). Em 2021 o projeto foi renomeado para PGCLab e teve o código fonte aberto sob a GPLv3 e tem sido utilizado como ambiente de estudo para vários alunos na graduação.

## Trabalhos acadêmicos
* [Diniz, L.; Knop, I. O. Geração procedural de conteúdo através de uma abordagem híbrida entre automatos celulares e heurísticas. SBGAMES. 2020.](https://www.sbgames.org/proceedings2020/WorkshopG2/209761.pdf)
* [Santana, G.; Knop, I. O. Avaliação do Fluxo da Experiência do Jogador na Geração Procedural por Autômatos Celulares. Monografia. 2021. ](http://monografias.ice.ufjf.br/tcc-web/downloadPdf?id=559)
* [Villa Verde, R. C.; Knop, I. O. Avaliação da geração de conteúdo por Wave Function Collapse na experiência do jogador. 2021. ](http://monografias.ice.ufjf.br/tcc-web/downloadPdf?id=572)
* [Dima , C. V. R.; Knop, I. O. Modelagem da Progressão de Dificuldade em Jogos para Mapas Gerados Proceduralmente. 2023. ](http://monografias.ice.ufjf.br/tcc-web/downloadPdf?id=713)

## Instalação
Após clonar o repositório, basta executar na linha de comando:

```bash
yarn install
yarn dev
```

Para gerar uma versão de produção, basta executar:

```bash
yarn build
```

##  Instruções de uso:
Uma versão online pode ser acessada [diretamente pelo navegador](https://ufjf-gamelab.github.io/pcglab/MazeRunner.html)

- *Setas do teclado*: Movimentação do personagem;</p>
- *P*: Ativa ou desativa o modo debug de modo que as colisões e detecção de grade não são verificadas;</p>
- *M*: Muda os elementos que aparecem na bússola;</p>
- *F*: Ativa e desativa a tela cheia (Fullscreen);</p>
- *+*: Com o Debug mode ativado, este serve para aumentar o Zoom do mapa;</p>
- *-*: Com o Debug mode ativado, este serve para diminuir o Zoom do mapa;</p>
- *SHIFT Esquerdo*: Player corre em uma velocidade maior;</p>
- *CTRL Esquerdo*: Player ataca usando a espada;</p>
- *ESC*: Retorna ao menu principal e gera um novo Level.</p>


# Assets utilizados

##  Imagens:
- coin: https://opengameart.org/content/animated-coins
- slime: https://opengameart.org/content/slime-sprite-sheet
- flames: https://opengameart.org/content/lpc-flames

##  Áudios:
- coin: http://soundbible.com/2081-Coin-Drop.html
- teleporter - 01b: https://freesound.org/people/DWOBoyle/sounds/474179/

