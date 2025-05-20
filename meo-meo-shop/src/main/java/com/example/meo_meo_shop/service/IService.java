package com.example.meo_meo_shop.service;

import java.util.List;
import java.util.Optional;

public interface IService<T, ID> {
    List<T> getAll();
    Optional<T> getById(ID id);
    T create(T t);
    T update(ID id, T t);
    void delete(ID id);
}
