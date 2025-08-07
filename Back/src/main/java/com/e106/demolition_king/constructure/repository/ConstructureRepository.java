package com.e106.demolition_king.constructure.repository;

import com.e106.demolition_king.constructure.entity.Constructure;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConstructureRepository extends JpaRepository<Constructure, Integer> {
}
