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

    /**
     * @Route (path="/login", name="app_login")
     * @return JsonResponse
     * @var $user ?User
     */

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

    /**
     * @Route (path="/user-list", name="app_user_list", methods="GET")
     * @return JsonResponse
     * @var $user ?User
     */

    public function userList(UserRepository $userRepository): JsonResponse
    {
        return $this->json([
            'users' => $userRepository->findAllButMe($this->getUser())
        ], 200, []);

    }

}