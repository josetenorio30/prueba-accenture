package com.accenture.api.infrastructure.adapters.out.database;

import com.accenture.api.domain.entities.Franquicia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FranquiciaRepository extends JpaRepository<Franquicia, Long> {

}