package org.example.backendsocialparty.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.example.backendsocialparty.modelos.Usuario;
import org.example.backendsocialparty.repositorios.UsuarioRepositorio;
import org.example.backendsocialparty.servicios.UsuarioServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@AllArgsConstructor
public class JWTFilter extends OncePerRequestFilter {
    @Autowired
    private JWTService jwtService;

    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    @Autowired
    private UsuarioServicio usuarioServicio;


    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {


        final String authHeader = request.getHeader("Authorization");


        //Si viene por una url "/auth" lo dejamos pasar
        if (request.getServletPath().contains("/autorizacion")){
            filterChain.doFilter(request, response);
            return;
        }

        if(authHeader== null || !authHeader.startsWith("Bearer")){
            filterChain.doFilter(request,response);
            return;
        }

        String token = authHeader.substring(7);
        TokenDataDTO tokenDataDTO = jwtService.extractTokenData(token);

        if(tokenDataDTO!=null && SecurityContextHolder.getContext().getAuthentication() == null){
            Usuario usuario = (Usuario) usuarioServicio.loadUserByUsername(tokenDataDTO.getCorreo());

            if(usuario!= null && !jwtService.isExpired(token)){
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        usuario.getCorreo(),
                        usuario.getContrasena(),
                        usuario.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }

        }

        filterChain.doFilter(request, response);
    }
}
