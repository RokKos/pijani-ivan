using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class GameController : MonoBehaviour
{
    public static GameController Instance;


    [SerializeField] public CharacterController player;
    [SerializeField] public LevelController levelController;
    [SerializeField] public Transform minimapCamera;
    [SerializeField] private UiController uiController;

    private const string sceneGameOver = "ScenaNeuspeh";
    private const string sceneGameWon = "ScenaUspeh";

    public void EndLevel()
    {
        levelController.NextLevel();
        player.ResetPlayer();
    }

    public void GameOver()
    {
        SceneManager.LoadScene(sceneGameOver);
    }

    public void GameWon()
    {
        SceneManager.LoadScene(sceneGameWon);
    }

    public void DisplayKeyText()
    {
        uiController.DisplayOpenGates();
    }

    // Start is called before the first frame update
    void Start()
    {
        GameController.Instance = this;
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
