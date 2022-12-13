<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\CookieHelper;
use App\Service\JWTHelper;
use Doctrine\ORM\EntityManagerInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

class UserController extends AbstractController
{

    /** 
     * Fonction pour s'enregistrer
     * 
     * Renvoie un jwt qui sera mis dans le localstorage , l'id et le prenom du user.
     * set-cookie permet de créer un cookie , contient un autre jwt contenant les contenus autorisés. Voir CookieHelper 
    */
    #[Route('/register', name: 'app_register', methods: 'POST')]
    /** @var $user ?User */
    public function register(string $appSecret, Request $request, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $entityManager ,CookieHelper $cookieHelper) : JsonResponse {

        $user = new User();
        $request = json_decode($request->getContent(), true);
        $username = $request["username"];
        $password = $request["password"];

        $user->setUsername($username)
             ->setPassword($passwordHasher->hashPassword($user, $password));
        
        $entityManager->persist($user);
        $entityManager->flush();

        if($user === null){
            return $this->json([
                'message' => 'missing credentials',
            ], Response::HTTP_UNAUTHORIZED);
        }

        $jwtForRegister = JWT::encode([
            'username' => $user->getUsername(),
            'id' => $user->getId()
        ],
            $appSecret,
            'HS256');

        return $this->json([
            'message' => 'Nouvel utilisateur créé',
            'jwt' => $jwtForRegister,
            'userId' => $user->getId(),
            'username' => $user->getUsername(),
        ], 200, [
            'set-cookie' => $cookieHelper->createMercureCookie($user)
        ]);


    }

    /** 
     * Fonction pour se connecter 
     * 
     * Renvoie un jwt qui sera mis dans le localstorage , l'id et le prenom du user.
     * set-cookie permet de créer un cookie , contient un autre jwt contenant les contenus autorisés. Voir CookieHelper 
    */
    #[Route('/login', name: 'app_login', methods: 'POST')]
    /** @var $user ?User */
    public function login( string $appSecret , Request $request , CookieHelper $cookieHelper, JWTHelper $jwtHelper) : JsonResponse {

        // $user = $this->getUser();
        // if($user == null){ 
        //     return $this->json([
        //         'message' => 'missing credentials',
        //     ], Response::HTTP_UNAUTHORIZED);
        // }

        if ($user = $this->getUser()) {

            $jwtForLogin = JWT::encode([
                'username' => $user->getUsername(),
                'id' => $user->getId()
            ],$appSecret,'HS256');

            return $this->json([
                // 'jwt'=> $jwtHelper->createJWT($user),
                'jwt' => $jwtForLogin,
                'userId' => $user->getId(),
                'username' => json_decode($request->getContent(), true)['username'],
            ], 200, [
                'set-cookie' => $cookieHelper->createMercureCookie($user)
            ]);

        } else {
            return $this->json([
                'message' => 'missing credentials',
                ], Response::HTTP_UNAUTHORIZED);
        }

    }

    /** Fonction pour avoir la liste des utilisateurs sauf celui utilisé actuellement */
    #[Route('/user-list', name: 'user_list', methods: 'GET')]
    public function userList(UserRepository $userRepository): JsonResponse
    {

        return $this->json([
            'users' => $userRepository->findAllButMe($this->getUser())
        ], 200, [], ['groups' => 'main']);

    }

}