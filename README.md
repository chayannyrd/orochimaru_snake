```bash
git clone https://chayannyrd.github.io/orochimaru_snake/
cd repositorio
npm install

27/06/25  meu código atual permite múltiplas mudanças de direção antes do moverCobra() ser executado novamente, porque o evento keydown é tratado imediatamente, e o setInterval chama moverCobra() apenas a cada 140ms.
Então se eu mover a cobra 180ºc muito rápido ela vai colidir nela mesma. Meu código tem q permitir mudar a direção apenas uma vez por movimento. Vou declarar a variavel podeMudarDirecao com valor true, e chamar ela no fim da função moverCobra() 