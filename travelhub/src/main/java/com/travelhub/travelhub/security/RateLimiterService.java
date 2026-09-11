package com.travelhub.travelhub.security;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

// Limitador de taxa simples, em memoria — sem depender de Redis nem de nenhuma
// biblioteca externa, de proposito: a aplicacao roda numa unica instancia (nao
// horizontalmente escalada), entao um mapa em memoria resolve sem complexidade
// extra. Se um dia a aplicacao escalar pra varias instancias, isso precisa virar
// um contador compartilhado (Redis, por exemplo) — cada instancia hoje teria seu
// proprio contador isolado.
@Service
public class RateLimiterService {

    private static class Registro {
        final Deque<Long> timestamps = new ArrayDeque<>();
    }

    private final ConcurrentHashMap<String, Registro> registros = new ConcurrentHashMap<>();

    // janela deslizante: true se a "chave" (ex: ip+endpoint) ainda nao estourou o
    // limite de tentativas dentro da janela de tempo; ja registra a tentativa atual
    public boolean permitir(String chave, int maxTentativas, long janelaMs) {
        Registro registro = registros.computeIfAbsent(chave, k -> new Registro());
        long agora = System.currentTimeMillis();

        synchronized (registro) {
            while (!registro.timestamps.isEmpty() && agora - registro.timestamps.peekFirst() > janelaMs) {
                registro.timestamps.pollFirst();
            }
            if (registro.timestamps.size() >= maxTentativas) {
                return false;
            }
            registro.timestamps.addLast(agora);
            return true;
        }
    }
}
