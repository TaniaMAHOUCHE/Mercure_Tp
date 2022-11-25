<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Firebase\JWT\JWT;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

class UserController extends AbstractController
{

    #[Route('/register', name: 'app_register', methods: 'POST')]
    /** @var $user ?User */
    public function register(string $appSecret, Request $request, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $entityManager) : JsonResponse {

        $user = new User();
        $request = json_decode($request->getContent(), true);
        $username = $request["username"];
        $password = $request["password"];

        $user->setUsername($username)
             ->setPassword($passwordHasher->hashPassword($user, $password));

        // dd($user);
        
        $entityManager->persist($user);
        $entityManager->flush();

        if($user === null){
            return $this->json([
                'message' => 'missing credentials',
            ], Response::HTTP_UNAUTHORIZED);
        }

        $jwt = JWT::encode([
            'username' => $user->getUsername(),
            'id' => $user->getId()
        ],
            $appSecret,
            'HS256');

        return $this->json([
            'message' => 'Nouvel utilisateur créé',
            'username' => $username,
            'password' => $password,
            'jwt' => $jwt
        ]);


        // return $this->json([
        //     'jwt' => $jwt
        // ]);

    }

    #[Route('/login', name: 'app_login', methods: 'POST')]
    /** @var $user ?User */
    public function login(string $appSecret) : JsonResponse {

        $user = $this->getUser();

        if($user === null){
            return $this->json([
                'message' => 'missing credentials',
            ], Response::HTTP_UNAUTHORIZED);
        }

        $jwt = JWT::encode([
            'username' => $user->getUsername(),
            'id' => $user->getId()
        ],
            $appSecret,
            'HS256');

        return $this->json([
            'jwt' => $jwt
        ]);

    }

    #[Route('/user-list', name: 'user_list', methods: 'GET')]
    public function userList(UserRepository $userRepository): JsonResponse
    {
        return $this->json([
            'users' => $userRepository->findAllButMe($this->getUser())
        ], 200, [], ['groups' => 'main']);

    }

}