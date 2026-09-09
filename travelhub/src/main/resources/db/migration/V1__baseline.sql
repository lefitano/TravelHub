-- Baseline: schema exatamente como estava em producao/dev antes de existir o
-- Flyway nesse projeto (gerado via ddl-auto=update do Hibernate). A partir daqui,
-- toda mudanca de schema deve vir como uma nova migration (V2, V3, ...), nunca
-- mais direto via ddl-auto.
--
-- Num banco ja existente (com ddl-auto=update), essa migration NAO roda de fato —
-- o Flyway so marca essa versao como "ja aplicada" (baseline-on-migrate=true).
-- Num banco novo (do zero, ex: CI ou primeira instalacao), ela roda de verdade e
-- cria tudo.

CREATE TABLE `usuarios` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `data_cadastro` datetime(6) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `foto_url` varchar(255) DEFAULT NULL,
  `token_recuperacao_expiracao` datetime(6) DEFAULT NULL,
  `token_recuperacao_senha` varchar(255) DEFAULT NULL,
  `email_verificado` bit(1) DEFAULT NULL,
  `token_verificacao_email` varchar(255) DEFAULT NULL,
  `token_verificacao_expiracao` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKkfsp0s1tflm1cwlj8idhqsad0` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `eventos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `data_fim` date NOT NULL,
  `data_inicio` date NOT NULL,
  `descricao` varchar(255) NOT NULL,
  `destino` varchar(255) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `criador_id` bigint DEFAULT NULL,
  `tipo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKkadjftmfm41w8b0kmtoso58fx` (`criador_id`),
  CONSTRAINT `FKkadjftmfm41w8b0kmtoso58fx` FOREIGN KEY (`criador_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `participantes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `status_pagamento` enum('CANCELADO','PAGO','PENDENTE') DEFAULT NULL,
  `evento_id` bigint NOT NULL,
  `usuario_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKq5ktbcli05tp34k7qartkhvel` (`evento_id`),
  KEY `FKr0dkcran4oyr30jc27gr7mlkx` (`usuario_id`),
  CONSTRAINT `FKq5ktbcli05tp34k7qartkhvel` FOREIGN KEY (`evento_id`) REFERENCES `eventos` (`id`),
  CONSTRAINT `FKr0dkcran4oyr30jc27gr7mlkx` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `despesas` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `descricao` varchar(255) NOT NULL,
  `valor` decimal(38,2) NOT NULL,
  `evento_id` bigint NOT NULL,
  `usuario_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKry6aokt8trugjiuk45jjcmjht` (`evento_id`),
  KEY `FK81p6vcta42utt15r5xt04vo84` (`usuario_id`),
  CONSTRAINT `FK81p6vcta42utt15r5xt04vo84` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `FKry6aokt8trugjiuk45jjcmjht` FOREIGN KEY (`evento_id`) REFERENCES `eventos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `despesa_participantes` (
  `despesa_id` bigint NOT NULL,
  `participante_id` bigint NOT NULL,
  KEY `FK5u3tfvvxxdqgi7oi979ohm0w2` (`participante_id`),
  KEY `FKcyqiqrxtsbtlfi5wslo2g1qku` (`despesa_id`),
  CONSTRAINT `FK5u3tfvvxxdqgi7oi979ohm0w2` FOREIGN KEY (`participante_id`) REFERENCES `participantes` (`id`),
  CONSTRAINT `FKcyqiqrxtsbtlfi5wslo2g1qku` FOREIGN KEY (`despesa_id`) REFERENCES `despesas` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `votacoes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `evento_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK36mkbkg8qn8j4qfiio33a6csd` (`evento_id`),
  CONSTRAINT `FK36mkbkg8qn8j4qfiio33a6csd` FOREIGN KEY (`evento_id`) REFERENCES `eventos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `opcaovoto` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `descricao` varchar(255) NOT NULL,
  `votacao_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKdabq399i3toc1fafg7lqcj6vt` (`votacao_id`),
  CONSTRAINT `FKdabq399i3toc1fafg7lqcj6vt` FOREIGN KEY (`votacao_id`) REFERENCES `votacoes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `votos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `opcao_voto_id` bigint NOT NULL,
  `participante_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKe7qwdkdmn670xnmy6ia9ex4w0` (`opcao_voto_id`),
  KEY `FKj8km4su0cxhdha28c63k2gvfe` (`participante_id`),
  CONSTRAINT `FKe7qwdkdmn670xnmy6ia9ex4w0` FOREIGN KEY (`opcao_voto_id`) REFERENCES `opcaovoto` (`id`),
  CONSTRAINT `FKj8km4su0cxhdha28c63k2gvfe` FOREIGN KEY (`participante_id`) REFERENCES `participantes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
