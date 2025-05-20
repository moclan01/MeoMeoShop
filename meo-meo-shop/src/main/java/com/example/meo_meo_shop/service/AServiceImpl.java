package com.example.meo_meo_shop.service;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public abstract class AServiceImpl<T, ID> implements IService<T, ID> {
    protected final JpaRepository<T, ID> repository;

    protected AServiceImpl(JpaRepository<T, ID> repository) {
        this.repository = repository;
    }

    @Override
    public List<T> getAll() {
        return repository.findAll();
    }

    @Override
    public Optional<T> getById(ID id) {
        return repository.findById(id);
    }

    @Override
    public T create(T entity) {
        return repository.save(entity);
    }

    @Override
    public void delete(ID id) {
        repository.deleteById(id);
    }

    @Override
    public T update(ID id, T entity) {
        throw new UnsupportedOperationException("Update must be implemented in subclass");
    }
}
