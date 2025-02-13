package org.example.backendsocialparty.servicios;

import org.example.backendsocialparty.DTOs.FavoritoDTO;
import org.example.backendsocialparty.modelos.Cliente;
import org.example.backendsocialparty.modelos.Entrada;
import org.example.backendsocialparty.modelos.Favorito;
import org.example.backendsocialparty.modelos.Publicacion;
import org.example.backendsocialparty.repositorios.ClienteRepositorio;
import org.example.backendsocialparty.repositorios.FavoritoRepositorio;
import org.example.backendsocialparty.repositorios.PublicacionRepositorio;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FavoritoServicio {

    private final FavoritoRepositorio favoritoRepositorio;
    private final ClienteRepositorio clienteRepositorio;
    private final PublicacionRepositorio publicacionRepositorio;

    public FavoritoServicio(FavoritoRepositorio favoritoRepositorio, ClienteRepositorio clienteRepositorio, PublicacionRepositorio publicacionRepositorio) {
        this.favoritoRepositorio = favoritoRepositorio;
        this.clienteRepositorio = clienteRepositorio;
        this.publicacionRepositorio = publicacionRepositorio;
    }

    public List<FavoritoDTO> listarLikes(int idCliente) {
        Cliente cliente = clienteRepositorio.findById(idCliente)
                .orElseThrow(() -> new RuntimeException("ID de cliente inexistente"));
        List<Favorito> listaFavoritos = favoritoRepositorio.findByCliente(cliente);
        List<FavoritoDTO> listaFavoritosDTO = new ArrayList<>();
        for (Favorito favorito : listaFavoritos) {
            listaFavoritosDTO.add(getFavoritoDTO(favorito));
        }
        return listaFavoritosDTO;
    }

    public List<FavoritoDTO> listarLikesPublicacion(int idPublicacion) {
        Publicacion publicacion = publicacionRepositorio.findById(idPublicacion)
                .orElseThrow(() -> new RuntimeException("ID de cliente inexistente"));
        List<Favorito> listaFavoritos = favoritoRepositorio.findByPublicacion(publicacion);
        List<FavoritoDTO> listaFavoritosDTO = new ArrayList<>();
        for (Favorito favorito : listaFavoritos) {
            listaFavoritosDTO.add(getFavoritoDTO(favorito));
        }
        return listaFavoritosDTO;
    }

    public void darLike(FavoritoDTO favoritoDTO) {
        Cliente cliente = clienteRepositorio.findById(favoritoDTO.getId_cliente())
                .orElseThrow(() -> new RuntimeException("ID de cliente inexistente"));

        Publicacion publicacion = publicacionRepositorio.findById(favoritoDTO.getId_publicacion())
                .orElseThrow(() -> new RuntimeException("ID de publicación inexistente"));

        Favorito favorito = new Favorito();
        favorito.setCliente(cliente);
        favorito.setPublicacion(publicacion);
        favoritoRepositorio.save(favorito);
    }

    public void quitarLike(FavoritoDTO favoritoDTO) {
        Cliente cliente = clienteRepositorio.findById(favoritoDTO.getId_cliente())
                .orElseThrow(() -> new RuntimeException("ID de cliente inexistente"));

        Publicacion publicacion = publicacionRepositorio.findById(favoritoDTO.getId_publicacion())
                .orElseThrow(() -> new RuntimeException("ID de publicación inexistente"));

        Favorito favorito = favoritoRepositorio.findByClienteAndPublicacion(cliente, publicacion);
        favoritoRepositorio.delete(favorito);
    }

    public static FavoritoDTO getFavoritoDTO(Favorito f) {
        FavoritoDTO dtonuevo = new FavoritoDTO();
        dtonuevo.setId_cliente(f.getCliente().getId());
        dtonuevo.setId_publicacion(f.getPublicacion().getId());
        return dtonuevo;
    }

    public void eliminarLike(Integer id){
        List<Favorito> likes = favoritoRepositorio.findByCliente_Id(id);
        favoritoRepositorio.deleteAll(likes);
    }
}
